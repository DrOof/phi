Getting Started

To run the project, you'll require maven, java and postgres to be installed. 

The site runs on a community edition of Magnolia CMS (http://www.magnolia-cms.com/). 
Magnolia is provided as an external dependency that is overlayed with multiple artifacts.

#
# Step 1. Install your environment
#

Install Maven ( 3.2.1 will do the job ), Java ( use 1.8 ) and Postgres ( 9.3 will do the job ). 

#
# Step 2. Setting up the database
# 

Create a Postgres database ( call it magnolia_author ) and user ( magnolia_author and password magnolia_author ). Grant all privileges to the user. 

create database magnolia_author;
create user magnolia_author with password 'magnolia_author';
grant all privileges on database magnolia_author to magnolia_author;

#
# Step 3. Build the parent project
#

Build the project with Maven. Navigate to the phi-parent directory and build the project with maven. 

mvn clean install -DskipTests

#
# Step 4. Run the webapp in Jetty
#

In the phi-site project, use Maven to run Jetty. Jetty will run on port 8080 by default.

mvn jetty:run