# Marvel Serach

This project will prove useful when exploring the marvel character api. This app help users search for their favourite marvel character.
Angular version 19.0.2.

## Features

- Search by Name (Starting with)
- Search by Events the character is present in
- Search by Comics the character appears in

## Configuration

In order for this project to work you will need to fill in the public and private keys to the marvel api inside the `/public/app.config.json` file.
After that the application will make use of this credentials in order to make calls to the marvel api

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Production server

After building our application we can generate a production ready container that will serve our built application

```bash
docker compose up --build
```
Once the container is running, open your browser and navigate to `http://localhost:8080/`

