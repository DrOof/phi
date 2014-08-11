<div class="slider-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="slider-content-title"> ${content.title} </h4>
    </#if>
    <div class="slider">
        <ul class="slider-list">
            <@cms.area name='content' />
        </ul>
        <a href="#" rel="slider:forward" class="slider-nav-link slider-nav-forward-link"><i class="icon-adyen-chevron-right"></i></a>
        <a href="#" rel="slider:back" class="slider-nav-link slider-nav-back-link"><i class="icon-adyen-chevron-left"></i></a>
    </div>
</div>