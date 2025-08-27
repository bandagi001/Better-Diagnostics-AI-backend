create database ti_dev;
use ti_dev;

CREATE TABLE User (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    userName varchar(255),
    password varchar(255) NOT NULL,
    token text(65535),
    PRIMARY KEY (_id),
    apiKey varchar(255),
    keyName varchar(255),
    keyExpiry varchar(255),
    opgLimit varchar(5) default 15,
    rvgLimit varchar(5) default 30,
    licenseExpiry varchar(50) default null,
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 
CREATE TABLE UserProfile (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    practiceName varchar(255),
    address varchar(255),
    street varchar(255),
    city varchar(255),
    pin varchar(255),
    countryCode varchar(5),
    countryName varchar(50),
    phoneNumber varchar(255),
    userId INT,
    CONSTRAINT fk_profile_user
    FOREIGN KEY (userId) 
	   REFERENCES User(_id),
    PRIMARY KEY (_id),
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);

describe UserProfile;

CREATE TABLE UserImageUpload (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    imageType varchar(255) NOT NULL ,
    imageCount varchar(255),
    userId INT,
    patientId varChar(255),
    CONSTRAINT fk_image_upload_user
    FOREIGN KEY (userId) 
	   REFERENCES User(_id),
    PRIMARY KEY (_id),
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);

select * from UserImageUpload;

SELECT * FROM Patient;
SELECT * FROM PatientVisit;
SELECT * FROM OTP;

CREATE TABLE Patient (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    dateofBirth varchar(255) NULL,
    mobile varchar(255) NULL,
    gender varchar(255) NULL,
    profileImg varchar(255),
    location varchar(255),
    imageName varchar(255),
    patientId varchar(255),
    userId INT,
    CONSTRAINT fk_user
    FOREIGN KEY (userId) 
	   REFERENCES User(_id),
    PRIMARY KEY (_id),
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE PatientVisit (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    visitFor varchar(255) NOT NULL,
    visitId varchar(255) NOT NULL,
    doctorNote LONGTEXT,
    findingFeedback varchar(255),
    findingJson LONGTEXT,
    savedImageData LONGTEXT,
    patientId INT,
    CONSTRAINT fk_patient
    FOREIGN KEY (patientId) 
	   REFERENCES Patient(_id),
    PRIMARY KEY (_id),
    images text(65535),
    imgType varchar(255),
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE OTP (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    otp varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    PRIMARY KEY (_id),
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE Subscriber (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    email varchar(255) NOT NULL,
    PRIMARY KEY (_id),
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE ChartNote (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    tag varchar(255) NOT NULL,
    note LONGTEXT NOT NULL,
    patientId INT,
    CONSTRAINT fk_cn_patient
    FOREIGN KEY (patientId) 
	   REFERENCES Patient(_id),
    PRIMARY KEY (_id),
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE S3Config (
    _id int NOT NULL AUTO_INCREMENT UNIQUE,
    secretAccessKey varchar(255) NOT NULL,
    accessKeyId varchar(255) NOT NULL,
    region varchar(255) NOT NULL,
    PRIMARY KEY (_id),
    createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
);