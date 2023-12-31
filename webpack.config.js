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
    adminSingle: "./src/js/admin/single.js",
    error404: "./src/js/pages/error404.js",
    authors: "./src/js/pages/authors.js",
    article: "./src/js/pages/article.js",
    recipe: "./src/js/pages/recipe.js",
    shared: "./src/js/shared.js",
    likes: "./src/js/likes/likes.js",
    share: "./src/js/share/share.js",
    rating: "./src/js/rating/rating.js",
    articleContents: "./src/js/contents/articleContents.js",
    recipeContents: "./src/js/contents/recipeContents.js",
    comments: "./src/js/comments/comments.js",
    embed: "./src/js/embed/embed.js",
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
        { from: "partials/sections/*.php", to: "./" },
        { from: "src/img", to: "assets/img" },
      ],
    }),
  ],
  entry: {
    adminSingle: "./src/js/admin/single.js",
    error404: "./src/js/pages/error404.js",
    authors: "./src/js/pages/authors.js",
    article: "./src/js/pages/article.js",
    recipe: "./src/js/pages/recipe.js",
    shared: "./src/js/shared.js",
    likes: "./src/js/likes/likes.js",
    share: "./src/js/share/share.js",
    rating: "./src/js/rating/rating.js",
    articleContents: "./src/js/contents/articleContents.js",
    recipeContents: "./src/js/contents/recipeContents.js",
    comments: "./src/js/comments/comments.js",
    embed: "./src/js/embed/embed.js",
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
