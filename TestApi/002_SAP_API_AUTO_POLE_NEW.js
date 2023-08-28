const { it } = require('mocha');
const pactum = require('pactum');
const fs = require('fs');
const csv = require('csv-parser');
//const payload = require('../payload/postdata.json');
const username = "HWKN45"
const password = "WsaREWuio!@$1358532124326868$$%";


describe('API Tests', function () {
    before(function () {
        // Any setup code you need before running the tests
    });

    after(function () {
        // Any teardown code you need after running the tests
    });

    async function loadTestCases() {
        return new Promise((resolve, reject) => {
            const testCases = [];

            function loadConfig() {
                try {
                    const configFile = fs.readFileSync('configfileQA.json');
                    const config = JSON.parse(configFile);
                    return config;
                } catch (error) {
                    console.error('Error loading configuration:', error);
                    return null;
                }
            }

            const config = loadConfig();
            var jsonname = config;
            console.log('Loaded configuration:', config);
            console.log('Loaded :', jsonname);

            // Read test data from CSV file
            fs.createReadStream('userdatafile.csv')
                .pipe(csv())
                .on('data', (data) => {
                    testCases.push(data);
                    console.log(`data started`);
                })
                .on('end', () => {
                    resolve(testCases);
                    console.log(`data ended`);
                })
                .on('error', (error) => {
                    reject(error);
                    console.log(`data error`);
                });
        });
    }




    it('should run API tests', async function () {
        const testCases = await loadTestCases();

        console.info(testCases);

        // Loop through each test case
        for (const testCase of testCases) {
            await executeTestCase(testCase);
        }
    });

    async function executeTestCase(testCase) {
        const testName = testCase.testName;
        //const url = testCase.url;
        const url = "https://quality.pab.hec.ondemand.com/sap/opu/odata/sap/UI_SOURCINGPROJECT_MANAGE/SourcingProject?$filter=SourcingProjectName eq 'event mesh'";
        const method = testCase.method;
        const headers = parseHeaders(testCase.headers);
        //const params = parseParams(testCase.params);
        // const params = parseParams(testCase.params);
        const data = testCase.data;
        const expectedStatus = testCase.expectedStatus;
        const Statusinthefile = testCase.expectedStatus;

        /*
        console.log(`Int or float on expectedstatus: ${expectedStatus}`);
        console.log(`What do I get from testdata file: ${Statusinthefile}`);
        console.log(`What do I get from testdata file headers: ${headers}`);
        console.log(`What do I get from testdata file method: ${method}`);
        */

        try {
            console.log(`Executing test: ${testName}`);


            // Create Pactum spec
            const spec = pactum.spec()
                .withPath(url)
                .withMethod(method)
                .withHeaders(headers)
                .withQueryParams("$format", "json")
                //.withQueryParams(params)
                .withBody(data)
                .withAuth(username, password)
            //.expectJsonMatch(expectJson)
            //.withJson(payload)
            //.expectStatus(Number(expectedStatus))
            //.expectBodyContains("VL_SH_ORDEB");

            // Execute the request and get the response
            const response = await spec.end();


            // const response = await spec.end()
            // .expectStatus(expectedStatus)
            // .expectHeader('content-type', 'application/json');


            // Perform additional assertions or validations as needed
            // console.log(`Response status: ${response.status}`);
            // console.log(`Response body: ${response.body}`);
        } catch (error) {
            // Handle errors
            console.error(`Test failed: ${testName}`);
            console.error(error);
        }
    }

    function parseHeaders(headerString) {
        const headers = {};

        if (headerString) {
            const headerList = headerString.split(',');

            for (const header of headerList) {
                const [key, value] = header.split(':').map((s) => s.trim());
                headers[key] = value;
            }
        }

        return headers;
    }

    function parseParams(paramString) {
        const params = {};

        if (paramString) {
            const paramList = paramString.split(',');

            for (const param of paramList) {
                const [key, value] = param.split('=').map((s) => s.trim());
                params[key] = value;
            }
        }

        return params;
    }
});
