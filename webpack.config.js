var HtmlWebpackPlugin = require("html-webpack-plugin");
//var path = require("path");
module.exports = {
  mode: "development",
  //context: path.join(__dirname, "src"),
  //entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader"
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader"
          }
        ]
      },

      {
        test: /\.(jpeg|jpg|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: "url-loader",
        options: {
          limit: 8192
        }
      },
      // {
      //   test: /(\.css$)/,
      //   loaders: ["style-loader", "css-loader", "postcss-loader"]
      // },

      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
        //include: /flexboxgrid/
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Charbot",
      template: "./src/index.html"
    })
  ],
  devServer: {
    historyApiFallback: true
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: "http://localhost:4000"
    })
  }
};
