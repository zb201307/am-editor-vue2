export default {
	esm: 'rollup',
	cjs: 'rollup',
	runtimeHelpers: true,
    extraBabelPlugins:[
        ['babel-plugin-import', {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'es',
            style: true,
        }],
    ],
};
