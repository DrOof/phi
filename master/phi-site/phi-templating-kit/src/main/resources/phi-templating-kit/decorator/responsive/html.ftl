<!DOCTYPE html>
<html lang="en"> 
    <head>
        
        <@cms.init />
        
        <#include 'include/head.ftl' />
        
    </head>
    <body>
        
        <div class="grid">
            <#include def.parameters.view ! '' />
        </div>
        
        
        <#include 'include/nav.ftl' />
        <#include 'include/script.ftl' />
        
    </body>
</html>