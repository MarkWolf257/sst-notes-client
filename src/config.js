const dev = {
    s3: {
        REGION: "eu-north-1",
        BUCKET: "dev-notes-infra-s3-uploads4f6eb0fd-1wr4oh3k4g8cr",
    },
    apiGateway: {
        REGION: "eu-north-1",
        URL: "https://dl2qkhnip3.execute-api.eu-north-1.amazonaws.com/dev",
    },
    cognito: {
        REGION: "eu-north-1",
        USER_POOL_ID: "eu-north-1_mEuWaPG61",
        APP_CLIENT_ID: "38rojn86nhbdpn0rpo08vdln2s",
        IDENTITY_POOL_ID: "eu-north-1:56e28b43-3aed-4fe0-bca7-5c7707392b35",
    },
};

const prod = {
    s3: {
        REGION: "eu-north-1",
        BUCKET: "prod-notes-infra-s3-uploads4f6eb0fd-rblcf7i0e2n1",
    },
    apiGateway: {
        REGION: "eu-north-1",
        URL: "https://iuyvszjsw0.execute-api.eu-north-1.amazonaws.com/prod",
    },
    cognito: {
        REGION: "eu-north-1",
        USER_POOL_ID: "eu-north-1_P09yGIoge",
        APP_CLIENT_ID: "3tv3213p52jhstokmvr4pbdh03",
        IDENTITY_POOL_ID: "eu-north-1:a8758c64-56da-4d5a-bde8-134e3d473c5f",
    },
};

const config = {
    MAX_ATTACHMENT_SIZE: 5000000,

    ...(process.env.REACT_APP_STAGE === "prod" ? prod : dev),
};

export default config;