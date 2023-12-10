const { src, dest } = require('gulp');

function copyIcons() {
	src('src/nodes/Discord/**/*.{png,svg}')
		.pipe(dest('dist/nodes/Discord'))

	return src('src/nodes/Discord/**/*.{png,svg}')
		.pipe(dest('dist/credentials'));
}

exports.default = copyIcons;