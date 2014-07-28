#
# This script is a shorthand for rsyncing resources 
# to the live webapp when using "mvn tomcat7:run".
#
# TODO :    fix linking to static resources through 
#           the maven tomcat7 plugin.
#
#

rsync -r * ../../../../../target/tomcat/webapps/phi-webapp/phi-templating-kit/