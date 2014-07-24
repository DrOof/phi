<div class="link-list-content" cms:edit>
    <#if content.title ? has_content >
    <p class="link-list-content-title"> ${content.title} </p>
    </#if>
    <ul class="link-list">
        <@cms.area name = 'list' />
    </ul>
</div>