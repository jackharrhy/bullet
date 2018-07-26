'use strict';

module.exports = {
	files: {
		javascripts: {
			joinTo: {
				'vendor.js': /^(?!app)/,
				'bundle.js': /^app/,
			},
		},
		stylesheets: {
			joinTo: 'style.css',
		},
	},
	npm: {
		styles: {
			'normalize.css': ['normalize.css'],
		},
	},
	plugins: {
		babel: {
			presets: ['latest'],
		},
	},
};
