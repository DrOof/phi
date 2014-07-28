<section class="content">
    <div class="grid">
        <@cms.area name = "content" />
    </div>
    <div class="grid">
        <ul class="overview-list">
            <#list cmsfn.children( content, 'mgnl:page' ) as child>
            <li class="column four a">
                <@renderOverviewLink child />
            </li>
            </#list>            
        </ul>
    </div>
</section>

<#macro renderOverviewLink child>
<a class="overview-link theme-four contrast" href="${cmsfn.link( child )}">
    <#if child.title ? has_content >
    <h4 class="overview-link-title"> ${child.title} </h4>
    </#if>
    <#if child.abstract ? has_content >
    <div class="overview-link-text">
        ${ child.abstract ? substring( 0, 100 ) }
    </div>
    </#if>
</a>
</#macro>