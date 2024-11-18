FROM node:20
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source app into container
COPY . .

# setting app environment
ENV MODEL_URL=[url]
ENV APP_ENV=production
ENV APP_PORT=8080
ENV APP_HOST="0.0.0.0"

# run and expose the app
CMD ["npm", "start"]

EXPOSE 8080