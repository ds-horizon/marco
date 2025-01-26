const path = require('path');

module.exports = {
  entry: './src/index.web.tsx', // Entry point for the application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Output file
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'], // Resolve these file extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match .ts and .tsx files
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/, // Match .css files
        use: ['style-loader', 'css-loader', 'postcss-loader'], // Apply loaders
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000, // Development server port
  },
};
