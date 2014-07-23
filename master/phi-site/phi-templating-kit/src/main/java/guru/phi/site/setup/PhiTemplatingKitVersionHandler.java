package guru.phi.site.setup;

import info.magnolia.module.DefaultModuleVersionHandler;

/**
 * This class is optional and lets you manager the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class PhiTemplatingKitVersionHandler extends DefaultModuleVersionHandler {
    
    @Override
	protected void setInstallOrUpdateTasks( InstallContext context ) {
    	
    	System.out.println( context );
        
    }

}