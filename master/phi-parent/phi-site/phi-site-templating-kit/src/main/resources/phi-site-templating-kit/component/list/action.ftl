<div class="action-list-content" cms:edit>
    <#if content.title ? has_content >
    <p class="action-list-content-title"> ${content.title} </p>
    </#if>
    <ul class="action-list">
        <@cms.area name = 'list' />
    </ul>
</div>