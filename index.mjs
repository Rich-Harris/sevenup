export function create(sprite, manifest) {
	const base = document.createElement('canvas');
	base.width = sprite.naturalWidth;
	base.height = sprite.naturalHeight;

	const ctx = base.getContext('2d');
	ctx.drawImage(sprite, 0, 0);

	const canvas = file => {
		const b = manifest[file];
		if (!b) throw new Error(`Could not find ${file} in manifest`);

		const crop = document.createElement('canvas');
		crop.width = b[2];
		crop.height = b[3];

		crop.getContext('2d').putImageData(ctx.getImageData(...b), 0, 0);

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
		fetch(`${dir}/sprite.json`).then(r => r.json()),
		new Promise((fulfil, reject) => {
			const img = new Image();
			img.onload = () => fulfil(img);
			img.onerror = reject;
			img.src = `${dir}/sprite.png`;
		})
	]);

	return create(sprite, manifest);
}