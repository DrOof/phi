# this script is a shorthand for rsyncing resources to the live webapp when using "mvn tomcat7:run"
rsync -r * ../../../../../target/tomcat/webapps/phi-webapp/phi-templating-kit/