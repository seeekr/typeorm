import "reflect-metadata";
import {Connection} from "../../../../src/connection/Connection";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Post} from "./entity/Post";
import {expect} from "chai";

describe("persistence > null and default behaviour", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchemaOnConnection: true,

    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert value if it is set", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        post.title = "Category saved!";
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOneById(Post, 1);
        expect(loadedPost).to.exist;
        loadedPost!.should.be.eql({
            id: 1,
            title: "Category saved!"
        });

    })));

    it("should insert default when post.title is undefined", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOneById(Post, 1);
        expect(loadedPost).to.exist;
        loadedPost!.should.be.eql({
            id: 1,
            title: "hello default value"
        });

    })));

    it("should insert NULL when post.title is null", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        post.title = null;
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOneById(Post, 1);
        expect(loadedPost).to.exist;
        loadedPost!.should.be.eql({
            id: 1,
            title: null
        });

    })));

    it("should update nothing when post.title is undefined", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        post.title = "Category saved!";
        await connection.manager.save(post);

        post.title = undefined;
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOneById(Post, 1);
        expect(loadedPost).to.exist;
        loadedPost!.should.be.eql({
            id: 1,
            title: "Category saved!"
        });

    })));

    it("should update to null when post.title is null", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        post.title = "Category saved!";
        await connection.manager.save(post);

        post.title = null;
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOneById(Post, 1);
        expect(loadedPost).to.exist;
        loadedPost!.should.be.eql({
            id: 1,
            title: null
        });

    })));

});
