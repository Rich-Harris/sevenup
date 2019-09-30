let load_image;

if (typeof Blob !== 'undefined' && typeof createImageBitmap !== 'undefined') {
	const worker_url = URL.createObjectURL(new Blob(
		[`self.onmessage = e => { self.onmessage = null; eval(e.data); };`],
		{ type: 'application/javascript' }
	));

	const worker = new Worker(worker_url);

	const fn = () => {
		self.onmessage = e => {
			const { id, href } = e.data;

			fetch(href, { mode: 'cors' })
				.then(response => response.blob())
				.then(data => createImageBitmap(data))
				.then(bitmap => {
					self.postMessage({ id, bitmap }, [bitmap]);
				})
				.catch(error => {
					self.postMessage({
						id,
						error: {
							message: error.message,
							stack: error.stack
						}
					});
				});
		};
	};

	const code = fn.toString().replace(/^(function.+?|.+?=>\s*)\{/g, '').slice(0, -1);
	worker.postMessage(code);

	let uid = 1;

	load_image = src => {
		return new Promise((fulfil, reject) => {
			const id = uid++;

			worker.addEventListener('message', function handler(e) {
				if (e.data.id !== id) return;

				worker.removeEventListener('message', handler);

				if (e.data.error) {
					reject(e.data.error);
				}

				else fulfil(e.data.bitmap);
			});

			worker.postMessage({
				id,
				href: new URL(src, location.href).href
			});
		});
	};
} else {
	load_image = src => {
		return new Promise((fulfil, reject) => {
			const img = new Image();
			img.crossOrigin = new URL(src, window.location).origin !== window.location.origin;
			img.onload = () => fulfil(img);
			img.onerror = reject;
			img.src = src;
		});
	}
}

const get = (manifest, file) => {
	const crop = manifest[file];
	if (!crop) throw new Error(`Could not find ${file} in manifest`);
	return crop;
}

export function create(image, manifest) {
	const canvas = file => {
		const b = get(manifest, file);

		const [x, y, w, h] = b;

		const crop = document.createElement('canvas');
		crop.width = w;
		crop.height = h;

		crop.getContext('2d').drawImage(image, x, y, w, h, 0, 0, w, h);

		return crop;
	};

	const url = file => {
		return new Promise(fulfil => {
			canvas(file).toBlob(blob => {
				fulfil(URL.createObjectURL(blob));
			});
		});
	};

	const uv = file => {
		const [x, y, w, h] = get(manifest, file);
		return [
			x / image.width,
			y / image.height,
			(x + w) / image.width,
			(y + h) / image.height
		]
	};

	return { image, canvas, url, uv };
}

export async function load(dir) {
	const [image, manifest] = await Promise.all([
		load_image(`${dir}/sprites.png`),
		fetch(`${dir}/sprites.json`).then(r => r.json())
	]);

	return create(image, manifest);
}