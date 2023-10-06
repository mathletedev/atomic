const webpack = require("@nativescript/webpack");

module.exports = env => {
	webpack.init(env);

	webpack.mergeWebpack({
		resolve: { conditionNames: ["svelte", "require", "node"] }
	});

	return webpack.resolveConfig();
};
