# SuperSport - Frontend

## Project Maintainer

- Akarapol Dechakitti <<akarapol@central.tech>>
- Paradon Pimon <<paradon@central.tech>>
- Satawat Pakaya <<satawat@central.tech>>
- Supachai Vongwuthi <<supachai@central.tech>>

## Set up

### 1. Install prerequisites tools

```bash
# Install Node
brew install node

# Install Yarn
brew install yarn

# Install Redis
## Option 1 - Using Brew
brew install redis

## Option 2 - Using Docker
docker run --name ssp-fe-redis -p 6379:6379 -d redis
```

### 2. Clone the ssp-fe repository

```bash
git clone git@bitbucket.org:centraltechnology/ssp-fe.git
```

### 3. Install dependencies

```bash
cd ./ssp-fe

# Login to the npm enterprise registry (ctocore)
# Ask the project maintainer for the login credential.
npm login ctocore

# Install the dependencies
yarn install
```

### 4. Copy the `core-ui` folder from the `cto-core-frontend` repository

```bash
# Clone cto-core-frontend repository (outside the ssp-fe project)
git clone git@bitbucket.org:centraltechnology/cto-core-frontend.git

# Install cto-core-frontend dependencies
cd ./cto-core-frontend/packages/core-ui
yarn install

# Copy node_modules and bin folders in `cto-core-frontend/packages/core-ui` directory to `ssp-fe/node_modules/@central-tech/core-ui` directory
cp -r ./cto-core-frontend/packages/core-ui ./ssp-fe/node_modules/@cto-core
```

### 5. Add the following environment variables to your machine

```bash
BASE_URL=http://localhost:3000
GRAPHQL_URL=https://staging-coreapi.supersports.co.th/graphql

MAGENTO_BASE_URL=https://staging-mdc.supersports.co.th/rest/
MAGENTO_TOKEN=<ask the project maintainer>

JWT_SECRET=<ask the project maintainer>

REDIS_ENDPOINT=localhost
REDIS_PORT=6379
REDIS_DB=1
REDIS_EXPIRE_CATEGORY=120
REDIS_EXPIRE_GET_PRODUCTS=120
REDIS_EXPIRE_CMS=120

FB_APP_ID=128809734423723
FB_PAGES_ID=360785944888

GOOGLE_SITE_VERIFICATION=<ask the project maintainer>

SMTP_DOMAIN=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=GMAIL_USER
SMTP_PASSWORD=SMTP_SITE_KEY
CONTACT_US_EMAIL=EMAIL@CENTRAL.COM
```

### 6. Start the service

```bash
cd ./ssp-fe
yarn start:dev
```
