# Warehouse Management System (WMS)

A comprehensive warehouse management system built with Node.js and MongoDB for managing inventory, orders, and warehouse operations.

## Features

- Product and inventory management
- Location management with capacity tracking
- Order processing and fulfillment
- Picking, packing, and shipping workflows
- User authentication and authorization
- API documentation with Swagger and ReDoc

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd wms-project

# Install dependencies
npm install

# Create and configure .env file
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev
```

## API Documentation

Once the server is running, you can access the API documentation at:

- ReDoc: http://localhost:3001/api-docs
- Swagger UI: http://localhost:3001/api-docs/swagger

## Development

### Version Management

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) for versioning based on [Conventional Commits](https://www.conventionalcommits.org/).

To create a new release:

```bash
# Run the release script
npm run release

# Push the new version and tags
git push --follow-tags origin main
```

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License.