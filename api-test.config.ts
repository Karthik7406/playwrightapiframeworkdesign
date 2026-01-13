
const processENV = process.env.TEST_ENV;
const env = processENV || "qa";

console.log("Test environment is  ", env);

const config = {
    apiUrl: "https://conduit-api.bondaracademy.com/api",
    userEmail: "pwapiuser12@gmail.com",
    password: "pwapiuser@12",
}

if (env === "qa") {
    config.userEmail = "pwtest@test.com",
        config.password = "Welcome2"
}

if (env == "prod") {
    config.userEmail = "";
    config.password = ""
}


export { config };