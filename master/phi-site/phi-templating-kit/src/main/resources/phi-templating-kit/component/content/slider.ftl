<div class="slider-content" cms:edit>
    <#if content.title ? has_content >
    <p class="slider-content-title"> ${content.title} </p>
    </#if>
    <div class="slider">
        <ul class="slider-list">
            <@cms.area name = 'list' />
        </ul>
        <a href="#" rel="slider:forward" class="slider-forward-link"><i class="icon-adyen-chevron-right"></i></a>
        <a href="#" rel="slider:back" class="slider-back-link"><i class="icon-adyen-chevron-left"></i></a>
    </div>
</div>