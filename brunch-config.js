exports.files = {
	javascripts: {
		joinTo: {
			'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
			'bundle.js': /^app/
		},
	},
	stylesheets: {
		joinTo: 'style.css'
	}
};

exports.npm = {
	styles: {
		'normalize.css': ['normalize.css']
	}
};

exports.plugins = {
	babel: {
		presets: ['latest']
	}
};

