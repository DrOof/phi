package guru.phi.site.download;

import java.util.List;
import java.util.ArrayList;

public class PhiPackageDownloadManager {
    
    public static String PHI_CORE_MODULE        = "phi.core.js";
    public static String PHI_DOM_MODULE         = "phi.dom.js";
    public static String PHI_UI_MODULE          = "phi.ui.js";
    public static String PHI_UI_COLOR_MODULE    = "phi.ui.color.js";
    public static String PHI_UI_DIALOG_MODULE   = "phi.ui.dialog.js";
    public static String PHI_UI_SLIDER_MODULE   = "phi.ui.slider.js";
    public static String PHI_FORM_MODULE        = "phi.form.js";
    public static String PHI_GRAPH_MODULE       = "phi.graph.js";
    public static String PHI_MEDIA_MODULE       = "phi.media.js";
    
    public PhiPackageDownloadManager() {
        
    }
    
    public String concatenateFiles( String files ) {
        return "";
    }
    
    public String compressFiles( String files ) {
        return "";
    }
    
    public String minifyFiles( String files ) {
        return "";
    }
    
    public List<String> resolveDependencies( String module ) {
        
        List<String> dependencies = new ArrayList<String>();
        
        // loop through all dependencies
        // packages.join( module.getDependencies() );
        
        return dependencies;
        
    }
    
}