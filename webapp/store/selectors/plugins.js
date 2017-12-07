import { createSelector } from 'reselect';
import { comparePlugins } from '../../utils/utils';

const getPluginMetadata = state => state.plugins;

const getSortedPluginMetadata = createSelector(
  [getPluginMetadata],
  pluginMeta => {
    const subItems = new Map();

    const sortedPluginMetadata = Object.values(pluginMeta)
      .filter(plugin => {
        if (plugin.parent) {
          // if it has a parent then add it to corresponding array in subItems map
          // this is so that we can get all subItems and then sort later
          const { parent } = plugin;
          if (!subItems.has(parent)) {
            subItems.set(parent, [plugin]);
          } else {
            const children = subItems.get(parent);
            children.push(plugin);
            subItems.set(parent, children);
          }
          // don't return to array of top level items
          return false;
        } else {
          // only returning an array of the parents
          return true;
        }
      })
      .sort(comparePlugins)
      .map(parent => {
        // go through each parentItem to see if it has subItems
        const extendedParent = { ...parent };
        if (subItems.has(parent.name)) {
          // if subItems has a matching parent, then extend parent to include children
          const children = subItems.get(parent.name);
          extendedParent.subItems = children.sort(comparePlugins);
        }
        return extendedParent;
      });

    return sortedPluginMetadata;
  }
);

export default {
  getSortedPluginMetadata
};