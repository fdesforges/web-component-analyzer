import { SimpleTypeKind } from "ts-simple-type";
import { tsTest } from "../../helpers/ts-test";
import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module";
import { assertHasMembers } from "../../helpers/util";

tsTest("jsDoc: Handles @readonly on members", t => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(`
		/**
		 * @element
	     */
		class MyElement extends HTMLElement {
			/**
			 * @readonly
			 */
			myProp = "foo";
		}
	 `);

	const { members } = result.componentDefinitions[0]?.declaration();

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				modifiers: new Set(["readonly"]),
				type: () => ({ kind: SimpleTypeKind.STRING })
			}
		],
		t,
		checker
	);
});
