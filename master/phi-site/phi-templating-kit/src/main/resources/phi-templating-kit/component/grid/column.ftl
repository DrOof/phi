<div class="${resolveColumn(content.size!)}">
	<section cms:edit>
		<@cms.area name = 'content' />
	</section>
</div>

<#function resolveColumn size >

    <#local class = '' >
    
    <#switch size >

        <#case '25' >
            <#local class = 'columns four a' >
            <#break >

        <#case '33' >
            <#local class = 'columns three a' >
            <#break >

        <#case '50' >
            <#local class = 'columns two a' >
            <#break >

        <#case '66' >
            <#local class = 'columns three b' >
            <#break >

        <#case '75' >
            <#local class = 'columns four c' >
            <#break >
            
        <#default >
            <#local class = 'columns' >
            <#break >
            
    </#switch>
    
    <#return class >

</#function>