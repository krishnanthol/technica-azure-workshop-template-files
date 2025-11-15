import { cosmosClient } from "./app";
// all purpose utility functions for cosmos
import { SqlParameter } from "@azure/cosmos";

// Get a container
export function getContainer(database: string, container: string) {
  return cosmosClient.database(database).container(container);
}

// Generic add
export async function addItem<T>(
  item: T,
  databaseName: string,
  containerName: string
): Promise<T> {
  try {
    const container = getContainer(databaseName, containerName);
    const { resource } = await container.items.create(item);
    return resource as T;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
}

// Generic get all items
export async function getAllItems<T>(
  databaseName: string,
  containerName: string
): Promise<T[]> {
  try {
    const container = getContainer(databaseName, containerName);
    const { resources } = await container.items.readAll<T>().fetchAll();
    return resources;
  } catch (error) {
    console.error("Error getting all items:", error);
    throw error;
  }
}

// Generic get single item by id
export async function getItem<T>(
  id: string,
  databaseName: string,
  containerName: string
): Promise<T | null> {
  try {
    const container = getContainer(databaseName, containerName);
    const { resource } = await container.item(id, id).read<T>();
    return resource || null;
  } catch (error) {
    console.error("Error getting item:", error);
    throw error;
  }
}

// Generic query items
export async function queryItems<T>(
  databaseName: string,
  containerName: string,
  query: string,
  parameters?: SqlParameter[]
): Promise<T[]> {
  try {
    const container = getContainer(databaseName, containerName);
    const { resources } = await container.items
      .query<T>({
        query,
        parameters: parameters || [],
      })
      .fetchAll();
    return resources;
  } catch (error) {
    console.error("Error querying items:", error);
    throw error;
  }
}

// Generic delete
export async function deleteItem(
  id: string,
  partitionKey: string,
  databaseName: string,
  containerName: string
) {
  try {
    const container = getContainer(databaseName, containerName);
    await container.item(id, partitionKey).delete();
    return { id };
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}
