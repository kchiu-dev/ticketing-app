# ticketing-app     ** WORK IN PROGRESS **

This application is a website built upon a microservices architecture that allows business owners to sell tickets online based on the name and price. 
Then other users who log in can purchase tickets posted online using a credit card.

This is a rough draft of the application but many changes and improvements are on the way.


# Tech Stack

Client is built with NextJS (ReactJS) and APIs are built with Express and GraphQL. All data in the application is defined using a managed GraphQL Federated Schema (https://studio.apollographql.com/graph/gateway-ticketing-graph/?variant=current).

The application is deployed to Okteto Cloud using kustomize and kubectl. It's ready to run on Okteto Cloud by clicking on the big green button below:

[![Develop on Okteto](https://okteto.com/develop-okteto.svg)](https://cloud.okteto.com/deploy)



# Acknowledgements

This application is built upon the Udemy course "Microservices with NodeJS and React" by Stephen Grider with many infrastructure changes including code refactoring and support for managing TLS certificates.

Thanks to Stephen for the initial implementation that inspired a lot of additional work on this microservices app!
