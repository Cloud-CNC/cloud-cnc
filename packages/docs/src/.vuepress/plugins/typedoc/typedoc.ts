/**
 * @fileoverview TypeDoc markdown renderer
 */

//Imports
import {Application, ParameterType, ProjectReflection, Renderer, RendererEvent, TSConfigReader, TypeDocReader} from 'typedoc';
import {Options, SidebarInformation} from './types';
import {PageOptions} from '@vuepress/core';
import {VuepressTheme, VuepressThemeOptionsReader} from './theme';
import {formatPath} from './utils';
import {load} from 'typedoc-plugin-markdown';

/**
 * Render the specified TypeScript code to markdown
 * @param input TypeDoc input options
 * @param output VuePress output options
 * @param watch Whether or not to watch the TypeScript code
 * @param callback Callback invoked whenever the TypeScript code is changed
 */
const render = async (options: Options, watch: boolean, callback: (pages: PageOptions[], sidebar?: SidebarInformation) => void | Promise<void>) =>
{
  //Create the app
  const app = new Application();

  //Disable plugin auto-discovery
  app.options.setValue('plugin', []);

  //Add the base markdown theme
  load(app);

  //Add the VuePress theme
  app.renderer.defineTheme('vuepress', VuepressTheme);

  //Add readers
  app.options.addReader(new TSConfigReader());
  app.options.addReader(new TypeDocReader());
  app.options.addReader(new VuepressThemeOptionsReader());

  //Add prefix
  app.options.addDeclaration({
    help: '[VuePress Plugin] Path prefix',
    name: 'prefix',
    type: ParameterType.String
  });

  //Override the renderer
  let pages: PageOptions[] = [];
  app.renderer.render = async function render(this: Renderer, project, outputDirectory)
  {
    //Ensure the theme is loaded
    //@ts-expect-error The method is private
    if (!this.prepareTheme())
    {
      return;
    }

    //Convert to an event
    const renderEvent = new RendererEvent(RendererEvent.BEGIN, outputDirectory, project);

    //Get URL mappings
    const mappings = this.theme?.getUrls(project) ?? [];
    renderEvent.urls = mappings;

    //Reset pages
    pages = [];

    //Render documents
    for (const mapping of mappings)
    {
      //Create a page event
      const pageEvent = renderEvent.createPageEvent(mapping);

      //Render the page
      const content = this.theme?.render(pageEvent);

      //Add the page
      pages.push({
        content,
        path: formatPath(options.prefix, mapping.url)
      });
    }

    //Trigger end of rendering
    this.trigger(RendererEvent.END, renderEvent);
  };

  //Bootstrap the app
  app.bootstrap({
    ...options.typedoc,
    prefix: options.prefix
  } as Record<string, any>);

  /**
   * Generate documentation
   * @param project Typedoc project
   */
  const generate = async (project: ProjectReflection) =>
  {
    //Generate the documentation
    await app.generateDocs(project, '');

    //Get sidebar information
    let sidebar: SidebarInformation | undefined;
    if (options.sidebar != null)
    {
      //Cast the theme
      const theme = app.renderer.theme as VuepressTheme;

      //Get navigation information
      const navigation = theme.getNavigation(project);

      //Get sidebar information
      sidebar = theme.getSidebar(navigation);

      //Format root item title
      if (options.sidebar.text == null)
      {
        //Capitalize the first letter
        if (sidebar.text.length > 0)
        {
          sidebar.text = sidebar.text[0].toUpperCase() + sidebar.text.substring(1);
        }
      }
      else
      {
        sidebar.text = options.sidebar.text;
      }
    }

    //Invoke the callback
    await callback(pages, sidebar);
  }

  if (watch)
  {
    //Watch the code and generate documentation
    app.convertAndWatch(generate);
  }
  else
  {
    //Convert the project
    const project = app.convert();

    if (project == null)
    {
      return;
    }

    //Generate documentation
    await generate(project);
  }
};

//Export
export default render;