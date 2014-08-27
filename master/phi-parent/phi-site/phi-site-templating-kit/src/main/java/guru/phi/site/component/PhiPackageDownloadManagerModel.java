package guru.phi.site.component;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;

import javax.jcr.Node;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

// FIXME : move to phi-site-package-manager module
public class PhiPackageDownloadManagerModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
	
	public static Logger logger = LogManager.getLogger( PhiPackageDownloadManagerModel.class ); 
    
    public static final String PHI_JS_COLOR     = "phi-js-color";
    public static final String PHI_JS_CORE      = "phi-js-core";
    public static final String PHI_JS_DIALOG    = "phi-js-dialog";
    public static final String PHI_JS_DOM       = "phi-js-dom";
    public static final String PHI_JS_EXT       = "phi-js-ext";
    public static final String PHI_JS_FORM      = "phi-js-form";
    public static final String PHI_JS_GRAPH     = "phi-js-graph";
    public static final String PHI_JS_MEDIA     = "phi-js-media";
    public static final String PHI_JS_SLIDER    = "phi-js-slider";
    
    public PhiPackageDownloadManagerModel( Node content, RD definition, RenderingModel<?> parent, TemplateDefinitionRegistry templateDefinitions ) throws Exception {
        super( content, definition, parent );
    }

    @Override
    public String execute() {
        return super.execute();
    }
    
    public String resolveDependencies() {
    	
    	String result = "";
    	
    	/*
    	DefaultRepositorySystem system = new DefaultRepositorySystem();
    	DefaultRepositorySystemSession session = new DefaultRepositorySystemSession();
    	session.setLocalRepositoryManager( system.newLocalRepositoryManager( session, new LocalRepository( "target/local-repo" ) ) );
    	
    	CollectRequest request = new CollectRequest();
    	
    	try {
    		system.collectDependencies( session, request );	
    	} catch ( Exception e ) {
    		logger.info( e );
    	}
    	*/
    	
    	
    	// system.collectDependencies(arg0, arg1)
        
    	/*
        DefaultServiceLocator locator = new DefaultServiceLocator();
        locator.addService( RepositoryConnectorFactory.class, FileRepositoryConnectorFactory.class );
        locator.addService( RepositoryConnectorFactory.class, WagonRepositoryConnectorFactory.class );
        locator.setServices( WagonProvider.class, new ManualWagonProvider() );
        RepositorySystem system = locator.getService( RepositorySystem.class );
        
        DefaultRepositorySystemSession session = MavenRepositorySystemUtils.newSession();
        LocalRepository localRepo = new LocalRepository( "target/local-repo" );
        session.setLocalRepositoryManager( system.newLocalRepositoryManager( session, localRepo ) );
        session.setTransferListener( new ConsoleTransferListener() );
        session.setRepositoryListener( new ConsoleRepositoryListener() );

        Artifact artifact = new DefaultArtifact( "guru.phi:phi-js-core:3.0.0" );

        CollectRequest request = new CollectRequest();
        request.setRoot( new Dependency( artifact, "" ) );
        request.setRepositories( Booter.newRepositories( system, session ) );

        CollectResult result = system.collectDependencies( session, request );
        */
        
        return result;

    }
    
    public String resolveDownloadLink() {
        return "";
    }

}