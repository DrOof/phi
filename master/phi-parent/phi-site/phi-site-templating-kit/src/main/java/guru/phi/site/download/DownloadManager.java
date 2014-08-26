package guru.phi.site.download;

import java.util.List;
import java.util.ArrayList;

public class DownloadManager {
    
    public static String PHI_CORE_PACKAGE = "phi.core.js";
    public static String PHI_DOM_PACKAGE = "phi.core.js";
    public static String PHI_UI_PACKAGE = "phi.core.js";
    public static String PHI_FORM_PACKAGE = "phi.core.js";
    public static String PHI_GRAPH_PACKAGE = "phi.core.js";
    public static String PHI_MEDIA_PACKAGE = "phi.core.js";
    
    public DownloadManager() {
        
    }
    
    public String concatenateFiles( String files... ) {
        return "";
    }
    
    public String compressFiles( String files... ) {
        return "";
    }
    
    public String minifyFiles( String files.. ) {
        return "";
    }
    
    public List<String> resolveDependencies( String package ) {
        
        List<String> packages = new ArrayList<String>();
        
        // loop through all dependencies
        // packages.join( package.getDependencies() );
        
        return packages;
        
    }
    
}