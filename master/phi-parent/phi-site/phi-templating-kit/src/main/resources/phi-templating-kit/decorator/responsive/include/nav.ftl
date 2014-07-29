<@renderNavList model.navigation.horizontalNavigation.items />

<#macro renderNavList items>
<div class="nav">
    <div class="grid">
        <ul class="nav-list">
            <#list items as item>
                <li>
                    <@renderNavLink item />
                </li>
            </#list>
        </ul>
    </div>
</div>
</#macro>

<#macro renderNavLink item>
    <a href="${item.href!}" class="nav-link ${item.selected?string('selected', '')}">${item.title!}</a>
    <#if ( item.open || item.selected ) && item.items ? has_content>
        <@renderNavList item.items />
    </#if>
</#macro>