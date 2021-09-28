const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');




const mode = "development";
const config = {
	mode: mode,
	devtool: "eval-cheap-module-source-map",
	devServer: {
		static: path.resolve(__dirname, "build"),
		hot: true,
		client: {
			overlay: true,
		},
	},
	entry: "./src/javascripts/index.js",
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "build"),
	},
	resolve: {
		alias: {
			CssFolder: path.resolve(__dirname, 'src/stylesheets/')
		},
	},
	optimization: {
		minimize: true,
		minimizer: [
			 // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      		// `...`,
      		new TerserJSPlugin({}),
      		new CssMinimizerPlugin({})   		
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			title: 'Caching',
		}),
		new CleanWebpackPlugin(),
		new WebpackManifestPlugin(),
  		new MiniCssExtractPlugin({
  			filename: "[name].[contenthash].css"
  		}),
    ],
	module: {
	  rules: [
	    {
	      test: /\.m?js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['@babel/preset-env']
	        }
	      }
	    },
	    {
	        test: /\.css$/i,
	        use: [
		        MiniCssExtractPlugin.loader, 
		        { loader: "css-loader", options: { importLoaders: 1 }},
		        

		        {
		        	loader: "postcss-loader",
		        	options: {
		        		postcssOptions: {
		        			plugins: [
		        				[
		        					"autoprefixer",
		        				],
		        			],
		        		},
		        	},
		        },
	        ],
      	},
      	{
	        test: /\.s[ac]ss$/i,
	        use: [
	          // Creates `style` nodes from JS strings
	          MiniCssExtractPlugin.loader,
	          // Translates CSS into CommonJS
	          { loader: "css-loader", options: { importLoaders: 1 }},

	          {
		        	loader: "postcss-loader",
		        	options: {
		        		postcssOptions: {
		        			plugins: [
		        				[
		        					"autoprefixer",
		        				],
		        			],
		        		},
		        	},
		        },
	          // Compiles Sass to CSS
	          "sass-loader",
	        ],
      	},
	  ]
	}
}

module.exports = config;