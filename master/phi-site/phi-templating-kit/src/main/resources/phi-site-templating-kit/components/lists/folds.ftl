<div class="folding-list-content" cms:edit>
    [#if content.title ? has_content ]
    <p class="folding-list-content-title"> ${content.title} </p>
    [/#if]
    <ul class="folding-list">
        [@cms.area name = 'list' /]
    </ul>
</div>