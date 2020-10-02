const webpack = require("webpack");
const fs = require('fs');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const cssnano  =  require ( "cssnano" );
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin= require('copy-webpack-plugin');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/pages/views')

module.exports = env => {
  const isProduction = env.production === true;

  return {
    mode: isProduction ? "production" : "development",
    entry: {
      index: './src/index.js',
      styles: './src/styles/index.scss'
    },
    output: {
      path: path.join(__dirname, "dist"),
      publicPath: "/",
      filename: "js/index.js",
    },

    devtool: isProduction ? "source-map" : "inline-source-map",

    devServer: {
      contentBase: path.join(__dirname, "dist"),
      watchContentBase: true,
      publicPath: '/',
      openPage: 'index.html'
    },

    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/index.css"
      }),
      new CopyWebpackPlugin({
        patterns: [
        {
          from: './src/img-for-view',
          to: './img'
        }
    ]}),
      new webpack.HotModuleReplacementPlugin(),
      ...htmlPlugins
    ],

    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                reloadAll: true,
                sourceMap: true
              }
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "postcss-loader",
              options: {
               postcssOptions: {
                plugins: [
                  (() => {
                    if (isProduction) {
                      return autoprefixer(), cssnano();
                    } else return autoprefixer();
                  })()
                ],
               },
                sourceMap: true
              }
            },
            {
              loader: "resolve-url-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|woff|woff2|ttf|svg|webp)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: () => {
                  if (isProduction) {
                    return '[contenthash].[ext]'
                  } else return '[name].[ext]'
                },
                outputPath: (url, resourcePath, context) => {
                  if(/svg/.test(resourcePath)) {
                    return `img/svg/${url}`
                  }
                  if (/images/.test(resourcePath)) {
                    return `img/${url}`
                  }
                  if (/fonts/.test(resourcePath)) {
                    return `fonts/${url}`
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.html$/i,
          include: path.resolve(__dirname, 'src/pages/includes'),
          use: [
            {
              loader: "html-loader",
              options: {
                attributes: {
                  list: [
                    '...',
                    {
                      tag: 'link',
                      attribute: 'rel',
                      type: 'src',
                      filter: (tag, attribute) => {
                        if (/stylesheet/.test(attribute)) {
                          console.log(tag, attribute)
                          return false
                        }
                      }
                    },
                    {
                      tag: 'script',
                      attribute: 'src',
                      type: 'src',
                      filter: (tag, attribute) => {
                        console.log(tag, attribute)
                        return false
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    }

  }
}  