package guru.phi.site.package.setup;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.Task;
import info.magnolia.setup.initial.AddFilterBypassTask;

import java.util.ArrayList;
import java.util.List;

/**
 * This class is optional and lets you manager the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class PhiPackageManagerVersionHandler extends DefaultModuleVersionHandler {
    
    private final List<Task> tasks = new ArrayList<Task>(); 
    
    @Override
    protected List<Task> getExtraInstallTasks( InstallContext context ) {
        
        final List<Task> t = new ArrayList<Task>( tasks );
        
        /**
         * 
         * Perform any tasks here.
         * 
         */
            
        return t;
        
    }

}