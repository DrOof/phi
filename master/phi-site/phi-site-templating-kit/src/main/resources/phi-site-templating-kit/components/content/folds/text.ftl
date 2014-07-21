<div id="${content['jcr:uuid']}" class="folding-text-content" cms:edit>
    [#if content.title ? has_content ]
    <a href="#${content['jcr:uuid']}" class="folding-text-content-title"> ${content.title} </a>
    [/#if]
    <div class="folding-text">
    [#if content.description ? has_content ]
        ${cmsfn.decode(content).description}
    [/#if]
    </div>
</div>