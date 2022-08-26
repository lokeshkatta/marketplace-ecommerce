RUN LOCALLY:
    ################### To run project locally ########################
                            1. cd project
                            2. npm run setup
                            3. npm start
               LOCALHOST: http://localhost:8000/

    ###################################################################

HEROKU DEPLOYED SWAGGER URL:
    ####################### To use SWAGGER UI #########################

            HEROKU:https://marketplace-commerce.herokuapp.com/api-docs
                |-> 1. OPEN URL
                |-> 2. CHANGE SCHEMES TO HTTPS [HTTP,HTTPS]

    ###################################################################

API USAGE:
        GET /:
        GET /api/:
        GET /api/auth/:
        GET {Unauthorized Url Path Access}:
        GET /api/auth/logout/:
        Data Required: NA
        Functionality: Sends a list of login and register URL of not logged in.

        POST /api/auth/register:
        POST /api/auth/login:
        Data required: username,password, (type_of_user - not required for login)
        Functionality: Sends a list of Athenticated and Authorized URLs for login. Sends a list of login and register URL for register

        GET /api/buyer/list-of-sellers/:
        Data Required: NA
        Functionality: Sends a list of Seller_id and username

        GET /api/buyer/seller-catalog/:seller_id:
        Date Required: seller_id as a param
        Functionality: Sends a list of catalog consisting of products with id =  seller_id

        GET /api/buyer/seller-catalog/:seller_id/:catalog:
        Date Required: seller_id as a param, catalog as param
        Functionality: Sends a list of products for a particular catalog with id = seller_id

        POST /api/buyer/create-order/:seller_id:
        Date Required: seller_id as a param, List of products to buy (name, price,catalog, quantity)
        Functionality: Create a order in the DB.

        POST /api/seller/create-catalog:
        Date Required: seller_id as a param, List of products to insert in catalog (name, price,catalog)
        Functionality: Inserts the products in the DB with the seller id and catalog.

        GET /api/seller/orders:
        Date Required: NA
        Functionality: Retrieve the order details from DB using the logged In Id.        

        
