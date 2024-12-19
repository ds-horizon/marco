const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.web.tsx", // Entry point for the application
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // Output file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"], // Resolve these file extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match .ts and .tsx files
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/, // Match .css files
        use: ["style-loader", "css-loader", "postcss-loader"], // Apply loaders
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Template for the HTML file
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000, // Development server port
  },
};
