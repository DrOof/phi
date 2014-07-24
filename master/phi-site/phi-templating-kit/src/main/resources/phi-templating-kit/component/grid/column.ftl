<div class="${resolveColumn(content.size!)} ${content.theme!}">
    <section cms:edit>
		[@cms.area name = 'content' /]
	</section>
</div>

[#function resolveColumn size]

    [#local class = '' ]
    
    [#switch size ]
    
        [#case '16' ]
            [#local class = 'column six a' ]
            [#break ]
    
        [#case '20' ]
            [#local class = 'column five a' ]
            [#break ]

        [#case '25' ]
            [#local class = 'column four a' ]
            [#break ]

        [#case '33' ]
            [#local class = 'column three a' ]
            [#break ]

        [#case '50' ]
            [#local class = 'column two a' ]
            [#break ]

        [#case '66' ]
            [#local class = 'column three b' ]
            [#break ]

        [#case '75' ]
            [#local class = 'column four c' ]
            [#break ]
            
        [#default ]
            [#local class = 'column' ]
            [#break ]
            
    [/#switch]
    
    [#return class ]

[/#function]