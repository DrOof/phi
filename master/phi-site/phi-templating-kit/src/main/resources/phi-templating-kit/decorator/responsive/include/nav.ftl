<nav class="nav">
    
    <!-- 
        
        TODO : implement getNavigationByName( '' );
        
        model.navigation.horizontalNavigation.items
        
        // i.e. 
        model = content.getNavigationByName( 'nav' );
        
        model.navigation.items
            item.isActive
            item.isCurrent
            item.items // and so forth.
                item.isActive
                item.isCurrent
        
    -->
    <@renderNavList model.navigation.horizontalNavigation.items />
    
</nav>

<#macro renderNavList items>
    <ul class="nav-list">
        <#list items as item>
            <li>
                <@renderNavLink item />
            </li>
        </#list>
    </ul>
</#macro>

<#macro renderNavLink item>
    <a href="${item.href!}" class="nav-link ${item.selected?string('selected', '')}">${item.title!}</a>
    <#if ( item.open || item.selected ) && item.items ? has_content>
    <@renderNavList item.items />
    </#if>
</#macro>