<div class="${resolveColumn(content.size!)} theme-${content.theme!} ${content.contrast!?string('contrast','')}" cms:edit>
    <@cms.area name = 'content' />
</div>

<#function resolveColumn size>

    <#local class = '' >
    
    <#switch size >
    
        <#case '16' >
            <#local class = 'column six a' >
            <#break >
    
        <#case '20' >
            <#local class = 'column five a' >
            <#break >

        <#case '25' >
            <#local class = 'column four a' >
            <#break >

        <#case '33' >
            <#local class = 'column three a' >
            <#break >
            
        <#case '38' >
            <#local class = 'column phi a' >
            <#break >

        <#case '50' >
            <#local class = 'column two a' >
            <#break >
            
        <#case '62' >
            <#local class = 'column phi b' >
            <#break >

        <#case '66' >
            <#local class = 'column three b' >
            <#break >

        <#case '75' >
            <#local class = 'column four c' >
            <#break >
            
        <#default >
            <#local class = 'column' >
            <#break >
            
    </#switch>
    
    <#return class >

</#function>