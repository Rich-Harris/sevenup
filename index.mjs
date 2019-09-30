let load_image;

if (typeof Blob !== 'undefined' && typeof createImageBitmap !== 'undefined') {
	const worker_url = URL.createObjectURL(new Blob(
		[`self.onmessage = e => { self.onmessage = null; eval(e.data); };`],
		{ type: 'application/javascript' }
	));

	const worker = new Worker(worker_url);

	const fn = () => {
		self.onmessage = e => {
			fetch(e.data, { mode: 'cors' })
				.then(response => response.blob())
				.then(data => createImageBitmap(data))
				.then(bitmap => {
					self.postMessage({ bitmap }, [bitmap]);
				})
				.catch(error => {
					self.postMessage({
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

	load_image = src => {
		return new Promise((fulfil, reject) => {
			worker.onmessage = e => {
				if (e.data.error) {
					reject(e.data.error);
				}

				else fulfil(e.data.bitmap);
			};

			worker.postMessage(new URL(src, location.href).href);
		});
	};
} else {
	load_image = src => {
		return new Promise((fulfil, reject) => {
			const img = new Image();
			img.crossOrigin = new URL(dir, window.location).origin !== window.location.origin;
			img.onload = () => fulfil(img);
			img.onerror = reject;
			img.src = src;
		});
	}
}


export function create(sprite, manifest) {
	const canvas = file => {
		const b = manifest[file];
		if (!b) throw new Error(`Could not find ${file} in manifest`);

		const [x, y, w, h] = b;

		const crop = document.createElement('canvas');
		crop.width = w;
		crop.height = h;

		crop.getContext('2d').drawImage(sprite, x, y, w, h, 0, 0, w, h);

		return crop;
	};

	const url = file => {
		return new Promise(fulfil => {
			canvas(file).toBlob(blob => {
				fulfil(URL.createObjectURL(blob));
			});
		});
	};

	return { canvas, url };
}

export async function load(dir) {
	const [manifest, sprite] = await Promise.all([
		fetch(`${dir}/sprites.json`).then(r => r.json()),
		load_image(`${dir}/sprites.png`)
	]);

	return create(sprite, manifest);
}