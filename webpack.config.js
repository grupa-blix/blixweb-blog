const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const devConfig = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new CopyPlugin({
      patterns: [{ from: "src/img", to: "img" }],
    }),
  ],
  entry: {
    "app-base": "./src/js/app-base.js",
    "app-ui": "./src/js/app-ui.js",
    "app-navbar": "./src/js/app-navbar.js",
    "app-footer": "./src/js/app-footer.js",
    "app-recipe": "./src/js/app-recipe.js",
  },
  output: {
    path: path.resolve(__dirname, "assets"),
    filename: "js/[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "img/[hash][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
};

const prodConfig = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
    }),
    new CopyPlugin({
      patterns: [
        { from: "./style.css", to: "./" },
        { from: "./*.php", to: "./" },
        { from: "partials/*.php", to: "./" },
        { from: "src/img", to: "assets/img" },
      ],
    }),
  ],
  entry: {
    "app-base": "./src/js/app-base.js",
    "app-ui": "./src/js/app-ui.js",
    "app-navbar": "./src/js/app-navbar.js",
    "app-footer": "./src/js/app-footer.js",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "assets/js/[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[hash][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext][query]",
        },
      },
    ],
  },
};

module.exports = [devConfig, prodConfig];
