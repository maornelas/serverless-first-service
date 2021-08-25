# serverless-template-local-testing
Setting up our template and local testing

###### Install plugin serverless

```
serverless plugin install --name serverless-mocha
serverless plugin install --name serverless-pseudo-parameters
```
###### Create function 

```
sls create function -f testFunction --handler src/functions/testFunction.testFunction -p src/tests/
```
###### Intalll mocha and test

```
npm install -g mocha
mocha src/tests
```