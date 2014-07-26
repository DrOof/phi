<nav class="nav">
    
    <!-- 
        
        TODO : implement simple navigation model
        
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
    <a class="nav-link"></a>
</#macro>