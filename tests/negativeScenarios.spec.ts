import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";

[

    { userName: "dd", userNameErrorMessage: "is too short (minimum is 3 characters)" },
    { userName: "ddd", userNameErrorMessage: "" },
    { userName: "dddddddddddddddddddd", userNameErrorMessage: "" },
    { userName: "ddddddddddddddddddddddddd", userNameErrorMessage: "is too long (maximum is 20 characters)" },

].forEach(({ userName, userNameErrorMessage }) => {

    test(`Error message scenarios for ${userName}`, async ({ api }) => {
        const newUserResponse = await api
            .path("/users")
            .body({
                user: {
                    "email": "d",
                    "password": "d",
                    "username":userName
                }
            })
            .clearAuth()
            .postRequest(422);


        if(userName.length == 3 || userName.length == 20) {
            expect(newUserResponse.errors).not.toHaveProperty("username")
        }
        else {
            expect(newUserResponse.errors.username[0]).shouldEqual(userNameErrorMessage)
        }
    })
})