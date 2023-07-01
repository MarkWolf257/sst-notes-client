import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import LoaderButton from "./LoaderButton";

function waitForInit() {
  return new Promise((res, rej) => {
    const hasFbLoaded = () => {
      if (window.FB) {
        res();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

export default function FacebookButton({onLogin}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    await waitForInit();
    setIsLoading(false);
  }

  function handleClick() {
    window.FB.login(function(response) {
        if (response.status === 'connected') {
            handleResponse(response.authResponse);
        } else {
            handleError(response);
        }
    });
  }

  function handleError(error) {
    alert(error.status);
  }

  async function handleResponse(data) {
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };

    setIsLoading(true);

    try {
      const response = await Auth.federatedSignIn(
        "facebook",
        { token, expires_at },
        user
      );
      setIsLoading(false);
      onLogin(response);
    } catch (e) {
      setIsLoading(false);
      handleError(e);
    }
  }

    return (
        <LoaderButton
        block
        bsSize="large"
        bsStyle="primary"
        className="FacebookButton"
        onClick={handleClick}
        disabled={isLoading}
        >
        Login with Facebook
        </LoaderButton>
    );
}